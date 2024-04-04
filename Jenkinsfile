pipeline {
    agent any
    stages {
        stage('Install dependencies') {
      steps{
        
        script {
         sh('npm install')
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
                    
                    // Start the application
                    sh 'node ./bin/www'
                }
            }
        }
    }
}
