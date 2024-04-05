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
                    echo (
                        'test'
                    )
                    // You can run your unit tests here
                }
            }
        }

        stage('SonarQube Analysis') {
            steps{
                script {
                    def scannerHome = tool 'scanner'
                    withSonarQubeEnv {
                    sh "${scannerHome}/bin/sonar-scanner"
                        }
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
