import { Members } from '@prisma/client'
import { Html } from '@react-email/html'
import { Text } from '@react-email/text'

const paragraph = {
  fontSize: 16
}

export function EmailOtp({ code }: { code: string }) {
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

export function EmailMembershipStatus({ data }: { data: Partial<Members> }) {
  return (
    <Html lang='en'>
      <Text style={paragraph}>
        Dear <b>{data.opFirstName + ' ' + data.opLastName}</b>,
      </Text>
      <br />

      {data.status === 'approved' && (
        <Text style={paragraph}>
          Your membership application is <b>CONFIRMED</b> with Ref No.{' '}
          <u>
            <b>{data.code}</b>
          </u>
        </Text>
      )}

      {data.status === 'rejected' && (
        <>
          <Text style={paragraph}>
            Your membership application is <b>REJECTED</b>
          </Text>
          {data.message && (
            <Text style={paragraph}>
              <b>Message/Reason: </b>
              {data.message}
            </Text>
          )}
          <br />
        </>
      )}

      <Text style={paragraph}>
        <b>Full Name: </b>
        {data.opFirstName + ' ' + data.opLastName}
      </Text>

      <Text style={paragraph}>
        <b>Drugstore </b>
        {data.drugStoreName}
      </Text>

      <Text style={paragraph}>
        <b>Chapter: </b>
        {data.chapter}
      </Text>

      <br />
      <Text style={paragraph}>Thank you,</Text>
      <Text style={paragraph}>
        <b>DSAP Office </b>
      </Text>
    </Html>
  )
}
