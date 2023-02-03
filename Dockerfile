#
# Build stage
#
FROM maven:3.8.7-amazoncorretto-19 AS build
COPY . .
RUN mvn clean package

#
# Package stage
#
FROM amazoncorretto:19.0.2
COPY --from=build /target/chatapp-0.0.1-SNAPSHOT.jar chatapp.jar
# ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java","-jar","chatapp.jar"]