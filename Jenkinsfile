pipeline{
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
steps{
script {
        echo "aa"
}
}
}
stage('Build application') {
steps{
script {
  sh( 'npm start' )
}
}
}
}
}
