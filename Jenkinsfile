pipeline {
    agent any
    environment {
        GITHUB_TOKEN = credentials('github-token-actions')
        GITHUB_OWNER = 'SatriaBPY'
        GITHUB_REPO = 'testmuAI_wdio_mobile'
        GITHUB_API_URL = "https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}"
    }
    
    parameters {
        choice(
            name: 'ENV',
            choices: ['Local', 'Lambda'],
            description: 'Chose the environment to run the test on'
        )
    }
    
    stages {
        stage('Get Latest Run Build Number') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'github-token-actions', variable: 'GITHUB_TOKEN_SECRET')]) {
                        def beforeRunNumber = sh(
                            script: """
                                curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
                                "${GITHUB_API_URL}/actions/workflows/lambda-test.yml/runs?per_page=1" \
                                | jq -r '.workflow_runs[0].run_number // 0'
                            """,
                            returnStdout: true
                        ).trim()
        
                        env.BEFORE_RUN_NUMBER = beforeRunNumber
                        echo "Before run number: ${beforeRunNumber}"
                }
            }
        }
        stage('Trigger Github Action') {
            steps {
                script {
                    def trigerId = UUID.randomUUID().toString()
                    env.TRIGER_ID = trigerId
                    echo "Trigger workflow ID: ${trigerId}"
    
                    sh """
                        curl -s -X POST \\
                        -H "Accept: application/vnd.github+json" \\
                        -H "Authorization: Bearer $GITHUB_TOKEN" \\
                        "${GITHUB_API_URL}/actions/workflows/lambda-test.yml/dispatches" \\
                        -d '{
                            "ref": "main",
                            "inputs": {
                                "ENV": "${params.ENV}"
                            }
                        }'
                    """
                }
            }
        }
        stage('Wait & Validate workflow') {
            steps {
                script {
                    def testFailed = false
    
                    echo "Waiting for workflow to complete..."
    
                    def runId = null
    
                    for (int i = 0; i < 60; i++) {
                        runId = sh(
                            script: """
                                curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
                                "${GITHUB_API_URL}/actions/workflows/lambda-test.yml/runs?event=workflow_dispatch&per_page=5" \
                                | jq -r '.workflow_runs[]' \
                                | select(.run_number > ${env.BEFORE_RUN_NUMBER}) \
                                | .id | head -1
                            """,
                            returnStdout: true
                        ).trim()
    
                        if (runId) break
                        echo "Waiting new run........"
                        sleep 5
                    }
    
                    if (!runId) {
                        error "Failed to get run ID after 60 attempts"
                    }
    
                    env.GITHUB_RUN_ID = runId
                    echo "Found new run ID: $GITHUB_RUN_ID"
    
                    for (int i = 0; i < 90; i++) {
                        def result = sh(
                            script: """
                                curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
                                "${GITHUB_API_URL}/actions/runs/${runId}" \
                                | jq -r '.status + "|" + (.conclusion // "pending")'
                            """,
                            returnStdout: true
                        ).trim()
    
                        def parts = result.tokenize('|')
                        def status = parts[0]
                        def conclusion = parts.size() > 1 ? parts[1].trim() : "pending"
                        echo "Run status: $status, conclusion: $conclusion"
    
                        if (status == "completed") {
                            if (conclusion != "success") {
                                echo "Test failed: ${conclusion}"
                                testFailed = true
                                break
                            }
                            echo "Test passed"
                            return
                        }
                        sleep 15
                    }
                    env.TEST_FAILED = testFailed.toString()
    
                    if (testFailed) {
                        echo "Test failed: ${env.TEST_FAILED} but continuing download artifacts....."
                    }
                }
            }
        }
        stage('Download All Artifacts') {
            steps {
                withCredentials([string(credentialsId: 'github-token-actions', variable: 'GITHUB_TOKEN')]) {
                    script {
                        sh """
                            rm -rf allure-results
                            mkdir -p allure-results
    
                            echo "Checking Run id: ${env.GITHUB_RUN_ID}"
    
                            ARTIFACT_ID = ""
                            MAX_RETRIES = 15
                            RETRY_COUNT = 0
    
                            while [ -z "\$ARTIFACT_ID" ] || [ "\$ARTIFACT_ID" == "null" ]; do
                                if [ \$RETRY_COUNT -eq \$MAX_RETRIES ]; then
                                    echo "Error: So long waiting for artifact ID is not available"
                                    exit 1
                               fi
    
                                echo "Attempting to find artifact ID... (retry \$RETRY_COUNT of \$MAX_RETRIES)"
    
                                RESPONSE=\$(curl -s -L \
                                -H "Authorization: Bearer \$GITHUB_TOKEN" \
                                -H "Accept: application/vnd.github+json" \
                                -H "X-GitHub-Api-Version: 2022-11-28" \
                                "${GITHUB_API_URL}/actions/runs/${env.GITHUB_RUN_ID}/artifacts")
    
                                ARTIFACT_ID=\$(echo "\$RESPONSE" | jq -r '.artifacts[] | select(.name | contains("allure")) | .id' | head -1)
                                
                                if [ -z "\$ARTIFACT_ID" ] || [ "\$ARTIFACT_ID" == "null" ]; then
                                    echo "Artifact belum siap (kemungkinan sedang proses zipping di GitHub). Menunggu 20 detik..."
                                    sleep 20
                                    RETRY_COUNT=\$((\$RETRY_COUNT + 1))
                                fi
                            done
    
                            echo "Found artifact ID: \$ARTIFACT_ID. Downloading (~260MB)..."
                            
                            curl -L -H "Authorization: Bearer \$GITHUB_TOKEN" \
                                -o allure.zip \
                                "${GITHUB_API_URL}/actions/artifacts/\$ARTIFACT_ID/zip"
                            
                            if [ ! -f allure.zip ]; then
                                echo "Error: Allure.zip files Not found."
                                exit 1
                            fi
                            
                            echo "Extracting files..."
                            unzip -o allure.zip -d allure-results/
                            rm -f allure.zip
                            
                            echo "Success! Total files in allure-results: \$(ls allure-results/ | wc -l)"
                            ls allure-results/ | head -n 10
                        """
                    }
                }
            }
        }
        stage('Publish Allure Report') {
            steps {
                script {
                    echo "📊 Publishing Allure report..."
                
                    allure(commandline: 'allure-cli',
                        includeProperties: false,
                        jdk: '',
                        resultPolicy: 'LEAVE_AS_IS',
                        results: [[path: 'allure-results']])
                    echo "✅ Allure report published"
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "Tests completed, cleaning up..."
                def status = currentBuild.result ?: 'SUCCESS' 
                def emoji = status == 'SUCCESS' ? '✅' : '❌'
    
                currentBuild.displayName = "${emoji} Build ${status} | Date: ${currentBuild.buildTimeAsString}"
    
                currentBuild.description = """
                ${emoji}  Build ${status}
                🔧 Env: ${params.ENV}
                ⏱️ Duration: ${currentBuild.durationString.replace(' and counting', '')}
                👤 By: ${currentBuild.getBuildCauses()[0].userName ?: 'Auto'}
                """.stripIndent()
                sleep time: 3, unit: 'SECONDS'
                cleanWs()
            }
        }
    
        failure {
            script {
                if (env.TEST_FAILED == 'true') {
                    currentBuild.result = 'FAILURE'
                    echo "Pipeline marked as FAILED because tests failed"
                    
                    currentBuild.description = """
                    ❌ Build FAILED (Tests Failed)
                    🔧 Env: ${params.ENV}
                    ⏱️ Duration: ${currentBuild.durationString.replace(' and counting', '')}
                    👤 By: ${currentBuild.getBuildCauses()[0].userName ?: 'Auto'}
                    """.stripIndent()
                }
            }
        }
    }
}