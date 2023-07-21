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
		lambda.Start(func(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
			log.Println("In Lambda environment. Received request with path: ", req.Path)
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
			// return response from Lambda to APIGateway
			return events.APIGatewayProxyResponse{
				StatusCode: w.statusCode,
				Headers: map[string]string{
					"Access-Control-Allow-Origin":      " *",
					"Access-Control-Allow-Credentials": "true",
				},
				Body: string(w.body),
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
