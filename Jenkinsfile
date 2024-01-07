pipeline {
    agent {
        label 'Jenkins-static-agent'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '7'))
        // skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 1, unit: 'MINUTES')
        timestamps()
    }

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'master', description: '')
        string(name: 'DB_IMAGE_VERSION', defaultValue: 'develop', description: '')
        string(name: 'REDIS_IMAGE_VERSION', defaultValue: 'develop', description: '')
        string(name: 'UI_IMAGE_VERSION', defaultValue: 'develop', description: '')
        string(name: 'WEATHER_IMAGE_VERSION', defaultValue: 'develop', description: '')
        string(name: 'AUTH_IMAGE_VERSION', defaultValue: 'develop', description: '')
    }    

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker-cred')
    }

    stages {
        stage ('Checkout') {
            steps {
                dir("${WORKSPACE}/weather_real_app") {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${params.BRANCH_NAME}"]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[$class: 'LocalBranch']],
                        submoduleCfg: [],
                        userRemoteConfigs: [[
                            url: 'git@github.com:s5wesley/weather_real_app.git',
                            credentialsId: 'jenkins-github-key'
                        ]]
                    ])
                }
            }
        }

        stage('Open the compose file') {
            steps {
                script {
                    dir("${WORKSPACE}/weather_real_app/docker-compose") {
                        sh """
                            cat <<EOF > docker-compose.yml
version: '3.5'

services:
  db:
    container_name: weatherapp-db
    image: bulawesley/db:${params.DB_IMAGE_VERSION}
    environment:
      MYSQL_ROOT_PASSWORD: my-secret-pw
    volumes:
      - ./db-data:/var/lib/mysql
    networks:
      - weatherapp
    restart: always

  redis:
    container_name: weatherapp-redis
    image: bulawesley/redis:${params.REDIS_IMAGE_VERSION}
    networks:
      - weatherapp
    environment:
      REDIS_USER: redis
      REDIS_PASSWORD: redis
    volumes:
      - ./redis-data:/data
    restart: always

  weather:
    container_name: weatherapp-weather
    image: bulawesley/weather:${params.WEATHER_IMAGE_VERSION}
    expose:
      - 5000
    environment:
      APIKEY: ecbc396f46mshb65cbb1f82cf334p1fcc87jsna5e962a3c542
    networks:
      - weatherapp
    restart: always
    depends_on:
      - db
      - redis  # Weather depends on both db and redis
  auth:
    container_name: weatherapp-auth
    image: bulawesley/auth:${params.AUTH_IMAGE_VERSION}
    environment:
      DB_HOST: db
      DB_PASSWORD: my-secret-pw
    expose:
      - 8080
    networks:
      - weatherapp
    restart: always
    depends_on:
      - weather  # Auth depends on the weather service

  ui:
    container_name: weatherapp-ui
    image: bulawesley/ui:${params.UI_IMAGE_VERSION}
    environment:
      eric: eric
      AUTH_HOST: auth
      AUTH_PORT: 8080
      WEATHER_HOST: weather
      WEATHER_PORT: 5000
      REDIS_USER: redis
      REDIS_PASSWORD: redis
    expose:
      - 3000
    ports:
      - 3000:3000
    networks:
      - weatherapp
    restart: always
    depends_on:
      - auth  # UI depends on Auth

networks:
  weatherapp:

volumes:
  db-data:
  redis-data:
EOF
                        """
                    }
                }
            }
        }
        stage('Set image version') {
            steps {
                script {
                    dir("${WORKSPACE}/weather_real_app/docker-compose") {
                        settingUpVariable()
                    }
                }
            }
        }
        stage('Pull Images') {
            steps {
                script {
                    dir("${WORKSPACE}/weather_real_app/docker-compose") {
                        pullImages()
                    }
                }
            }
        }
        // stage('run') {
        //     steps {
        //         script {
        //             dir("${WORKSPACE}/code/jenkins/scripts") {
        //                 sh """
        //                     ls -l
        //                     sudo chmod +x cover-letter.sh
        //                     sudo bash cover-letter.sh ${params.PACKAGES} ${params.USERNAME} ${params.PASSWORD} ${params.EMAIL} ${params.FIRSTNAME} ${params.LASTNAME} ${params.ACCOUNT_MANAGEMENT}
        //                 """
        //             }
        //         }
        //     }
        // }
    }
}

def settingUpVariable() {
    sh """
    sed -i "s|DB_IMAGE_VERSION|${params.DB_IMAGE_VERSION}|g" docker-compose.yaml
    sed -i "s|REDIS_IMAGE_VERSION|${params.REDIS_IMAGE_VERSION}|g" docker-compose.yaml
    sed -i "s|UI_IMAGE_VERSION|${params.UI_IMAGE_VERSION}|g" docker-compose.yaml
    sed -i "s|WEATHER_IMAGE_VERSION|${params.WEATHER_IMAGE_VERSION}|g" docker-compose.yaml
    sed -i "s|AUTH_IMAGE_VERSION|${params.AUTH_IMAGE_VERSION}|g" docker-compose.yaml
    
    cat docker-compose.yaml
    """
}

def pullImages() {
    sh """
    sudo docker pull bulawesley/db:${params.DB_IMAGE_VERSION}
    sudo docker pull bulawesley/redis:${params.REDIS_IMAGE_VERSION}
    sudo docker pull bulawesley/ui:${params.UI_IMAGE_VERSION}
    sudo docker pull bulawesley/weather:${params.WEATHER_IMAGE_VERSION}
    sudo docker pull bulawesley/auth:${params.AUTH_IMAGE_VERSION}
    sudo docker images
    sudo docker-compose down
    sudo docker-compose up -d
    sudo docker-compose ps
    """
}
