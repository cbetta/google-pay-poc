// CONFIGURATION

const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
}

const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'gr4vy',
    'gatewayMerchantId': 'spider'
  }
}


const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"]
const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"]

const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks
  }
}

const cardPaymentMethod = Object.assign(
  { tokenizationSpecification: tokenizationSpecification },
  baseCardPaymentMethod
)

const isReadyToPayRequest = Object.assign({}, baseRequest)
isReadyToPayRequest.allowedPaymentMethods = [baseCardPaymentMethod]

const paymentDataRequest = Object.assign({}, baseRequest)
paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod]
paymentDataRequest.transactionInfo = {
  totalPriceStatus: 'FINAL',
  totalPrice: '123.45',
  currencyCode: 'USD',
  countryCode: 'US'
}

paymentDataRequest.merchantInfo = {
  merchantName: 'Example Merchant',
  merchantId: '12345678901234567890'
}

// EVENTS 

let paymentsClient = null

window.onload = () => checkGooglePayAvailability()

const checkGooglePayAvailability = () => {
  // load google pay client if available
  if (!google) { return }
  paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' })

  // check of google pay is available.
  paymentsClient.isReadyToPay(isReadyToPayRequest)
    .then((response) => {
      if (response.result) { showGooglePayButton() }
      else { console.log("Google Pay not supported") }
    })
    .catch(console.error)
}

const showGooglePayButton = () => {
  const button = document.querySelector('#gpay-button')
  button.addEventListener('click', handleGooglePay)
  button.classList.add('available')
}

const handleGooglePay = () => {
  paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
    // if using gateway tokenization, pass this token without modification
    paymentToken = paymentData.paymentMethodData.tokenizationData.token
    console.dir(paymentToken)
  }).catch(function (err) {
    // show error in developer console for debugging
    console.error(err)
  })
}
