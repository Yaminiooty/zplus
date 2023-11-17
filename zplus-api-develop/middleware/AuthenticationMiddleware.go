package middleware

import (
	"context"
	"errors"
	"net/http"
	"sec-tool/config"
	"sec-tool/structs"
	struct_errors "sec-tool/structs/errors"
	"sec-tool/utils"
	"strings"
	"github.com/gin-gonic/gin"
	"golang.org/x/exp/slices"
)

func JwtAuthentication(unProtectedRoutes []structs.RouteMetaData, redisConfig *config.RedisConfig) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if slices.ContainsFunc(unProtectedRoutes, func(routeMeta structs.RouteMetaData) bool {
			return ctx.Request.URL.String() == routeMeta.Url && ctx.Request.Method == routeMeta.MethodType
		}) {
			ctx.Next()
		} else {
			AuthorizationHeader := ctx.Request.Header["Authorization"]
			if len(AuthorizationHeader) == 0 {
				utils.SendJSONResponse("Missing Authorization header.", http.StatusUnauthorized, nil, nil, ctx)
				ctx.Abort()
				return
			} else {
				jwtTokenStr := strings.Split(AuthorizationHeader[0], "Bearer ")[1]

				_, err := redisConfig.Client.Get(context.TODO(), jwtTokenStr).Result()

				if err == nil {
					utils.SendJSONResponse("Expired JWT Token.", http.StatusUnauthorized, nil, nil, ctx)
					ctx.Abort()
					return
				}

				if err.Error() != "redis: nil" {
					utils.SendJSONResponse(err.Error(), http.StatusInternalServerError, nil, nil, ctx)
					ctx.Abort()
					return
				}

				_, err = utils.ValidateJWTToken(jwtTokenStr)

				if err != nil {
					if errors.Is(err, utils.INVALID_JWT_TOKEN_ERROR) {
						utils.SendJSONResponse(err.(struct_errors.InvalidJwtTokenError).Message, http.StatusUnauthorized, nil, nil, ctx)
					} else {
						utils.SendJSONResponse(err.(struct_errors.InternalServerError).Message, http.StatusInternalServerError, nil, nil, ctx)
					}

					ctx.Abort()
					return
				}
				claims, _ := utils.ExtractClaims(jwtTokenStr)
				user := claims["sub"].(string)
				ctx.Request.Header.Add("user", user)
				ctx.Next()
			}
		}
	}
}
