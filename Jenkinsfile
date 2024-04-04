pipeline {
    agent any
    stages {
        stage('Install dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }
        stage('Unit Test') {
            steps {
                script {
                    echo "Run your unit tests here"
                }
            }
        }
        stage('Build application') {
            steps {
                script {
                    sh './node_modules/.bin/nodemon ./bin/www'
                }
            }
        }
    }
}
