package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/kenya6565/pokemon_pokedex/graph"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	log.Println("Starting application...")

	// create new graphql instance
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	// CORS setting and request hundling of GraphQL
	h := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://pokemon-pokedex-jet.vercel.app"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request on path: ", r.URL.Path)
		switch r.URL.Path {
		case "/query":
			log.Println("Routing request to GraphQL handler...")
			srv.ServeHTTP(w, r)
		default:
			log.Println("Routing request to GraphQL playground...")
			playground.Handler("GraphQL playground", "/query").ServeHTTP(w, r)
		}
	}))

	if os.Getenv("AWS_EXECUTION_ENV") != "" {
		// Lambda environment
		// APIGatewayがHTTPリクエストを受け取り、それをLambdaが処理できる型（APIGatewayProxyRequest）で受け取る
		lambda.Start(func(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
			log.Println("In Lambda environment. Received request with path: ", req.Path)
			// Lambda関数はAPIGatewayProxyRequestを受け取り、これを通常のHTTPリクエストの形式（Golangの場合、http.Request）に変換
			// HTTPメソッド、リクエストパス、リクエストボディを指定
			r, err := http.NewRequest(
				strings.ToUpper(req.HTTPMethod),
				req.Path,
				strings.NewReader(req.Body),
			)
			if err != nil {
				return events.APIGatewayProxyResponse{}, err
			}

			// create new http header
			// Add headers and query string parameters to the request
			r.Header = http.Header{}
			// API GatewayからのマルチバリューヘッダーをGolangのhttpリクエストヘッダーに追加
			// 複数の場合も考慮
			for k, v := range req.MultiValueHeaders {
				for _, v2 := range v {
					r.Header.Add(k, v2)
				}
			}
			// get query parameters from URL
			q := r.URL.Query()
			// API GatewayからのクエリパラメーターをGolangのhttpリクエストのクエリパラメーターに追加
			// 複数の場合も考慮
			for k, v := range req.MultiValueQueryStringParameters {
				for _, v2 := range v {
					q.Add(k, v2)
				}
			}
			r.URL.RawQuery = q.Encode()

			// use to write http response and status code
			// when successfully generated response, return 200
			// when something went wrong, return its status code
			w := &responseWriter{statusCode: 200}

			// ハンドラーにレスポンスライターとAPIGatewayProxyRequestから作ったHTTPリクエストを渡して実行
			// resolvers.go ファイル内の具体的なリゾルバー関数が呼び出され、クエリまたはミューテーションの処理が行われ、その結果がレスポンスとしてクライアントに返される
			// これによりGraphQLリゾルバーが呼び出され、resolvers.go ファイル内の具体的なリゾルバー関数が呼び出され、クエリまたはミューテーションの処理が実行される
			// それによって生成されたレスポンスが w（レスポンスライター）に書き込まれる
			// その結果、wには、処理が完了した後にクライアントに送信するためのHTTPレスポンスが含まれます。
			h.ServeHTTP(w, r)

			// Convert http.Header to map[string]string
			// HTTPヘッダーを適切な形式に変換して、API Gatewayが期待するレスポンス形式に合わせている
			// 具体的にはevents.APIGatewayProxyResponse型を使うが、この型は、レスポンスのヘッダーをmap[string]string形式で要求
			// これにより、http.Header型からmap[string]string型への変換が行われ、API Gatewayが期待する形式にレスポンスが整形される
			// これによりCORS設定以外のヘッダー群を作成している
			headers := make(map[string]string)
			for name, values := range w.Header() {
				// ヘッダー名の正規化
				name = http.CanonicalHeaderKey(name)
				if len(values) > 0 {
					headers[name] = values[0]
				}
			}

			// CORS設定のためのヘッダー追加
			headers["Access-Control-Allow-Origin"] = "*"
			headers["Access-Control-Allow-Credentials"] = "true"
			headers["Content-Type"] = "application/json"

			// return response from Lambda to APIGateway
			// これが最終的にAPIGatewayに返されるレスポンス
			return events.APIGatewayProxyResponse{
				StatusCode: w.statusCode,
				Headers:    headers,
				// w.bodyの中にresolvers.goでの処理結果が入っている
				Body:       string(w.body),
			}, nil
		})
	} else {
		// Local environment
		log.Printf("In local environment. Connect to http://localhost:%s/ for GraphQL playground", defaultPort)
		err := http.ListenAndServe(":"+defaultPort, h)
		if err != nil {
			panic(err)
		}
	}

	log.Println("Application ended.")
}

type responseWriter struct {
	statusCode int
	body       []byte
	header     http.Header
}

func (w *responseWriter) WriteHeader(statusCode int) {
	w.statusCode = statusCode
}

func (w *responseWriter) Write(body []byte) (int, error) {
	w.body = body
	return len(body), nil
}

// h.ServeHTTP(w, r)メソッドでwをResponseWriterのいinterfaceで定義していてHeader()の記載が必須
func (w *responseWriter) Header() http.Header {
	if w.header == nil {
		w.header = make(http.Header)
	}
	return w.header
}
