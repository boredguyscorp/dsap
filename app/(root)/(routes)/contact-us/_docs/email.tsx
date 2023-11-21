import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { ContactForm } from './types'

const paragraph = {
  fontSize: 16
}

export function Email(props: { formData: ContactForm }) {
  const data = props.formData

  return (
    <Html lang='en'>
      <Text style={paragraph}>
        <b>You have received a new message from dsaph.org website.</b>
      </Text>

      <Text style={paragraph}>
        <b>Name: </b>
        {data.firstName + ' ' + data.lastName}
      </Text>

      <Text style={paragraph}>
        <b>Email: </b>
        {data.emailAdd}
      </Text>

      <Text style={paragraph}>
        <b>Phone No.: </b>
        {data.phoneNo}
      </Text>

      {data.message && (
        <Text style={paragraph}>
          <b>Message: </b>
          {data.message}
        </Text>
      )}
    </Html>
  )
}
