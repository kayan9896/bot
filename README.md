ibmcloud ce application create --name bot --build-source https://github.com/kayan9896/bot.git --build-context-dir bot --image us.icr.io/${SN_ICR_NAMESPACE}/bot --registry-secret icr-secret
