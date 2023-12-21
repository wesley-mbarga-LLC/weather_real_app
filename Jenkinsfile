pipeline {
    agent any

    environment {
        // Replace these placeholders with your actual Docker registry URL and credentials ID
        DOCKER_REGISTRY_URL = "https://hub.docker.com/u/bulawesley"
        DOCKER_REGISTRY_CREDENTIAL_ID = "dockerhub"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    // Build and push Docker images to the specified registry
                    withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIAL_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        // Log in to Docker registry
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} ${DOCKER_REGISTRY_URL}"

                        // Build and push Docker images
                        sh "docker build -t bulawesley/db -f db/Dockerfile ."
                        sh "docker push bulawesley/db"

                        sh "docker build -t bulawesley/redis -f redis/Dockerfile ."
                        sh "docker push bulawesley/redis"

                        sh "docker build -t bulawesley/weather -f weather/Dockerfile ."
                        sh "docker push bulawesley/weather"

                        sh "docker build -t bulawesley/auth -f auth/Dockerfile ."
                        sh "docker push bulawesley/auth"

                        sh "docker build -t bulawesley/ui -f ui/Dockerfile ."
                        sh "docker push bulawesley/ui"
                    }
                }
            }
        }

        stage('Deploy Docker Compose') {
            steps {
                script {
                    // Deploy Docker Compose
                    sh "docker-compose -f docker-compose.yml up -d"
                }
            }
        }
    }

    post {
        always {
            script {
                // Display the status of Docker Compose services
                sh "docker-compose -f docker-compose.yml ps"
            }
        }
    }
}
