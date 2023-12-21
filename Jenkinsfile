pipeline {
    agent {
        docker {
            image 'docker:20.10.9'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKER_REGISTRY_URL = "https://hub.docker.com/u/bulawesley"
        DOCKER_REGISTRY_CREDENTIAL_ID = "bulawesley"
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
                    docker.withRegistry(DOCKER_REGISTRY_URL, DOCKER_REGISTRY_CREDENTIAL_ID) {
                        docker.build("bulawesley/db", "-f db/Dockerfile .")
                        docker.build("bulawesley/redis", "-f redis/Dockerfile .")
                        docker.build("bulawesley/weather", "-f weather/Dockerfile .")
                        docker.build("bulawesley/auth", "-f auth/Dockerfile .")
                        docker.build("bulawesley/ui", "-f ui/Dockerfile .")

                        docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                            docker.image("bulawesley/db").push()
                            docker.image("bulawesley/redis").push()
                            docker.image("bulawesley/weather").push()
                            docker.image("bulawesley/auth").push()
                            docker.image("bulawesley/ui").push()
                        }
                    }
                }
            }
        }

        stage('Deploy Docker Compose') {
            steps {
                script {
                    sh "docker-compose -f docker-compose.yml up -d"
                }
            }
        }
    }

    post {
        always {
            script {
                sh "docker-compose -f docker-compose.yml ps"
            }
        }
    }
}
