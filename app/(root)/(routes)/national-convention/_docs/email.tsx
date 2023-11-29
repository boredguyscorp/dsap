import { conventions } from '@/app/(app.domain.com)/dashboard/convention/_components/constant'
import { ConventionRegistrationForm } from '@/lib/schema'
import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Link } from '@react-email/link'

const paragraph = {
  fontSize: 16
}

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '16px',
  textDecoration: 'underline'
}

export function EmailRegistrationConvention(props: { formData: ConventionRegistrationForm }) {
  const data = props.formData
  const conventionDetails = conventions.find((row) => row.code == data.convention)

  return (
    <Html lang='en'>
      <Text style={paragraph}>
        <b>Thank you for your Registration to {conventionDetails?.title}. For verification, here is what was received;</b>
      </Text>
      <br />
      <Text style={paragraph}>
        <b>Full Name: </b>
        {data.firstName + ' ' + data.lastName}
      </Text>
      <Text style={paragraph}>
        <b>Contact No.: </b>
        {data.contactNo}
      </Text>
      <Text style={paragraph}>
        <b>Email: </b>
        {data.emailAdd}
      </Text>
      {data.drugstoreInfo?.establishment && (
        <Text style={paragraph}>
          <b>Drugstore/Establishment: </b>
          {data.drugstoreInfo.establishment}
        </Text>
      )}
      {data.drugstoreInfo?.chapter && (
        <Text style={paragraph}>
          <b>Chapter: </b>
          {data.drugstoreInfo.chapter}
        </Text>
      )}

      <Link
        href={data.proofOfPaymentUrl}
        target='_blank'
        style={{
          ...link,
          display: 'block',
          marginBottom: '16px'
        }}
      >
        Click here to view your attach proof of payment
      </Link>

      <br />
      <Text style={paragraph}>Thank you,</Text>
      <Text style={paragraph}>
        <b>DSAP Office </b>
      </Text>
    </Html>
  )
}
