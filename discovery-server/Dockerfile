FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY . .
RUN mvn -B -pl discovery-server -am -DskipTests -Djib.skip=true package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /workspace/discovery-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
