import { Html } from '@react-email/html'
import { Text } from '@react-email/text'

const paragraph = {
  fontSize: 16
}

export default function EmailOtp({ code }: { code: string }) {
  return (
    <Html lang='en'>
      <Text>Here is your verification code for membership authentication</Text>
      <br />
      <Text style={paragraph}>
        <b>Code: </b>
        {code}
      </Text>
      <br />
      <Text style={{ fontSize: 14 }}>
        Please note that this OTP will only be valid for <b>1 hour</b>
      </Text>
      <br />
      <Text style={paragraph}>Thank you,</Text>
      <Text style={paragraph}>
        <b>DSAP Office </b>
      </Text>
    </Html>
  )
}
