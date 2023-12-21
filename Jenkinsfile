pipeline {
    agent any

    environment {
       DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'

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
