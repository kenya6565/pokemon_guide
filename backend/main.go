package main

import (
	"net/http"
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
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	h := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
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

	lambda.Start(func(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		r, err := http.NewRequest(
			strings.ToUpper(req.HTTPMethod),
			req.Path,
			strings.NewReader(req.Body),
		)
		if err != nil {
			return events.APIGatewayProxyResponse{}, err
		}

		w := &responseWriter{}
		h.ServeHTTP(w, r)
		return events.APIGatewayProxyResponse{
			StatusCode: w.statusCode,
			Body:       string(w.body),
		}, nil
	})
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
	body       []byte
}

func (w *responseWriter) WriteHeader(statusCode int) {
	w.statusCode = statusCode
}

func (w *responseWriter) Write(body []byte) (int, error) {
	w.body = body
	return len(body), nil
}
