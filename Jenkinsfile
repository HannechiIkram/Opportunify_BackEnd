pipeline {
    agent any
    stages {
        stage('Install dependencies') {
            steps {
                script {
                    // Install project dependencies
                    sh 'npm install'
                    // Fix any vulnerabilities found during audit
                    sh 'npm audit fix --force'
                    // Check for any funding opportunities for project dependencies
                    sh 'npm fund'
                }
            }
        }
        stage('Unit Test') {
            steps {
                script {
                    // You can run your unit tests here
                    echo "Running unit tests..."
                }
            }
        }
        stage('Build application') {
            steps {
                script {
                    // Install the required module
                    sh 'npm install ../Opportunify_BackEnd/midill/accescontrol'
                    // Start the application
                    sh 'node ./bin/www'
                }
            }
        }
    }
}
