ibmcloud ce application create --name bot --build-source https://github.com/kayan9896/bot --build-context-dir . --image us.icr.io/${SN_ICR_NAMESPACE}/bot --registry-secret icr-secret

ibmcloud ce build create --name b --build-type local --size large --image us.icr.io/${SN_ICR_NAMESPACE}/bot --registry-secret icr-secret
ibmcloud ce buildrun submit --name b --build b --source .
ibmcloud ce application create --name demo1 --image us.icr.io/${SN_ICR_NAMESPACE}/bot --registry-secret icr-secret --es 2G --port 8000 --minscale 1




https://demo1.1bnvewb2s3qc.us-south.codeengine.appdomain.cloud/
                            
