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
                    def beforeRunNumber = sh(
                        script: """
                            curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" \
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
                    def triggerId = UUID.randomUUID().toString()
                    env.TRIGGER_ID = triggerId
                    echo "Trigger workflow ID: ${triggerId}"
                    
                    sh """
                        curl -s -X POST \\
                        -H "Accept: application/vnd.github+json" \\
                        -H "Authorization: Bearer ${GITHUB_TOKEN}" \\
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
                    
                    // Mencari run ID yang baru
                    for (int i = 0; i < 60; i++) {
                        // Menggunakan jq langsung tanpa parsing Groovy
                        def newRunId = sh(
                            script: """
                                curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" \
                                "${GITHUB_API_URL}/actions/workflows/lambda-test.yml/runs?event=workflow_dispatch&per_page=10" \
                                | jq --arg before "${env.BEFORE_RUN_NUMBER}" '.workflow_runs[] | select(.run_number > (\$before | tonumber)) | .id' \
                                | head -1
                            """,
                            returnStdout: true
                        ).trim()
                        
                        if (newRunId && newRunId != "null" && newRunId != "") {
                            runId = newRunId
                            echo "Found new run ID: ${runId}"
                            break
                        }
                        
                        echo "Waiting for new run... attempt ${i+1}/60"
                        sleep 10
                    }
                    
                    if (!runId) {
                        error "Failed to get run ID after 60 attempts"
                    }
                    
                    env.GITHUB_RUN_ID = runId
                    
                    // Menunggu workflow selesai
                    for (int i = 0; i < 90; i++) {
                        def result = sh(
                            script: """
                                curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" \
                                "${GITHUB_API_URL}/actions/runs/${runId}" \
                                | jq -r '.status + "|" + (.conclusion // "pending")'
                            """,
                            returnStdout: true
                        ).trim()
                        
                        def parts = result.tokenize('|')
                        def status = parts[0]
                        def conclusion = parts.size() > 1 ? parts[1].trim() : "pending"
                        echo "Run status: ${status}, conclusion: ${conclusion} (attempt ${i+1}/90)"
                        
                        if (status == "completed") {
                            if (conclusion != "success") {
                                echo "Test failed: ${conclusion}"
                                testFailed = true
                                break
                            }
                            echo "Test passed"
                            break
                        }
                        sleep 15
                    }
                    
                    env.TEST_FAILED = testFailed.toString()
                    
                    if (testFailed) {
                        echo "Test failed but continuing to download artifacts....."
                    }
                }
            }
        }
        
        stage('Download All Artifacts') {
            steps {
                script {
                    sh """
                        rm -rf allure-results
                        mkdir -p allure-results
                        
                        echo "Checking Run ID: ${env.GITHUB_RUN_ID}"
                        
                        ARTIFACT_ID=""
                        MAX_RETRIES=20
                        RETRY_COUNT=0
                        
                        while [ -z "\${ARTIFACT_ID}" ] || [ "\${ARTIFACT_ID}" = "null" ]; do
                            if [ \${RETRY_COUNT} -eq \${MAX_RETRIES} ]; then
                                echo "Error: Timeout waiting for artifact"
                                exit 1
                            fi
                            
                            echo "Attempting to find artifact ID... (attempt \${RETRY_COUNT} of \${MAX_RETRIES})"
                            
                            RESPONSE=\$(curl -s -L \\
                                -H "Authorization: Bearer ${GITHUB_TOKEN}" \\
                                -H "Accept: application/vnd.github+json" \\
                                "${GITHUB_API_URL}/actions/runs/${env.GITHUB_RUN_ID}/artifacts")
                            
                            ARTIFACT_ID=\$(echo "\${RESPONSE}" | jq -r '.artifacts[] | select(.name | contains("allure")) | .id' | head -1)
                            
                            if [ -z "\${ARTIFACT_ID}" ] || [ "\${ARTIFACT_ID}" = "null" ]; then
                                echo "Artifact not ready yet, waiting 15 seconds..."
                                sleep 15
                                RETRY_COUNT=\$((\${RETRY_COUNT} + 1))
                            fi
                        done
                        
                        echo "Found artifact ID: \${ARTIFACT_ID}"
                        
                        echo "Downloading artifact..."
                        curl -L -H "Authorization: Bearer ${GITHUB_TOKEN}" \\
                            -o allure.zip \\
                            "${GITHUB_API_URL}/actions/artifacts/\${ARTIFACT_ID}/zip"
                        
                        if [ ! -f allure.zip ]; then
                            echo "Error: Failed to download allure.zip"
                            exit 1
                        fi
                        
                        echo "Extracting allure results..."
                        unzip -o allure.zip -d allure-results/
                        rm -f allure.zip
                        
                        echo "Success! Extracted \$(find allure-results -type f | wc -l) files"
                        echo "Sample files:"
                        ls allure-results/ | head -n 10
                    """
                }
            }
        }
        
        stage('Publish Allure Report') {
            steps {
                script {
                    echo "📊 Publishing Allure report..."
                    allure commandline: 'allure-cli',
                        includeProperties: false,
                        jdk: '',
                        resultPolicy: 'LEAVE_AS_IS',
                        results: [[path: 'allure-results']]
                    echo "✅ Allure report published"
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "Tests completed, cleaning up..."
                cleanWs()
            }
        }
        
        success {
            script {
                echo "✅ Pipeline completed successfully!"
                currentBuild.description = "✅ Build SUCCESS\nEnvironment: ${params.ENV}\nGitHub Run ID: ${env.GITHUB_RUN_ID}"
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline failed!"
                if (env.TEST_FAILED == 'true') {
                    echo "Tests failed in GitHub Actions workflow"
                    currentBuild.result = 'FAILURE'
                }
                currentBuild.description = "❌ Build FAILED\nEnvironment: ${params.ENV}\nCheck logs for details"
            }
        }
    }
}