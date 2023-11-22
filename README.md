ibmcloud ce application create --name bot --build-source https://github.com/kayan9896/bot --build-context-dir . --image us.icr.io/${SN_ICR_NAMESPACE}/bot --registry-secret icr-secret
