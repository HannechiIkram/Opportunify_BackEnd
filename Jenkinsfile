pipeline {
    agent any
    stages {
        stage('Install dependencies') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm audit fix --force'
                    sh 'npm fund'
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
                    
                    
                    sh 'node ./bin/www'
                }
            }
        }
    }
}
