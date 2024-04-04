pipeline {
    agent any
    stages {
        stage('Install dependencies') {
            steps {
                script {
                    // Install project dependencies
                    sh 'npm install'
                }
            }
        }
        stage('Unit Test') {
            steps {
                script {
                    // Perform unit tests (replace 'echo "aa"' with actual test commands)
                    echo "aaa"
                }
            }
        }
        stage('Build application') {
            steps {
                script {
                    // Start the application
                    sh 'npm start'
                }
            }
        }
    }
}

