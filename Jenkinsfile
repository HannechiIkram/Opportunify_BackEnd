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
                    // Install the accescontrol module
                    sh 'npm install ../Opportunify_BackEnd/midill/accescontrol'
                    
                    // Start the application
                    sh 'node ./bin/www'
                }
            }
        }
    }
}
