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
	// create new graphql instance
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	// CORS setting
	h := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // この部分は本番環境に合わせて変更してください
		AllowCredentials: true,
		Debug:            true,
	}).Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/query":
			srv.ServeHTTP(w, r)
		default:
			playground.Handler("GraphQL playground", "/query").ServeHTTP(w, r)
		}
	}))

	if os.Getenv("AWS_EXECUTION_ENV") != "" {
		// Lambda environment
		lambda.Start(func(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
			r, err := http.NewRequest(
				strings.ToUpper(req.HTTPMethod),
				req.Path,
				strings.NewReader(req.Body),
			)
			if err != nil {
				return events.APIGatewayProxyResponse{}, err
			}

			// use to write http response and status code
			w := &responseWriter{}
			h.ServeHTTP(w, r)
			// return response from APIGateway
			return events.APIGatewayProxyResponse{
				StatusCode: w.statusCode,
				Headers: map[string]string{
					"Access-Control-Allow-Origin":      "https://pokemon-pokedex-jet.vercel.app",
					"Access-Control-Allow-Credentials": "true",
				},
				Body: string(w.body),
			}, nil
		})
	} else {
		// Local environment
		log.Printf("connect to http://localhost:%s/ for GraphQL playground", defaultPort)
		err := http.ListenAndServe(":"+defaultPort, h)
		if err != nil {
			panic(err)
		}
	}
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
