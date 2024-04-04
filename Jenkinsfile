pipeline {
    agent any
    stages {
        stage('Install dependencies') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm run build-dev'
                }
            }
        }
       
        stage('Unit Test') {
            steps {
                script {
                    echo "Running unit tests..."
                    // You can run your unit tests here
                }
            }
        }
        
        stage('Build application') {
            steps {
                script {
                    sh('npm run build-dev')
                }
            }
        }
    }
}
