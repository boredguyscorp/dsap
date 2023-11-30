import { conventions } from '@/app/(app.domain.com)/dashboard/convention/_components/constant'
import { ConventionRegistrationForm } from '@/lib/schema'
import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Link } from '@react-email/link'
import { Prisma } from '@prisma/client'
import { MembershipStatus } from '@/app/(app.domain.com)/dashboard/convention/_components/membership'

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

type EmailRegistrationConfirmProps = {
  convention: string
  code: string
  firstName: string
  lastName: string
  emailAdd: string
  drugstoreInfo: Prisma.JsonValue
  message: string | null
  status: string
}

export function EmailRegistrationStatus({ data }: { data: EmailRegistrationConfirmProps }) {
  const conventionDetails = conventions.find((row) => row.code == data.convention)
  const dsInfo = data.drugstoreInfo as ConventionRegistrationForm['drugstoreInfo']

  return (
    <Html lang='en'>
      <Text style={paragraph}>
        Dear <b>{data.firstName + ' ' + data.lastName}</b>,
        {/* <b>Thank you for your Registration to {conventionDetails?.title}. For verification, here is what was received;</b> */}
      </Text>
      <br />

      {data.status === 'approved' && (
        <Text style={paragraph}>
          Your Registration as Delegate at {conventionDetails?.title} is <b>CONFIRMED</b> with Ref No.{' '}
          <u>
            <b>{data.code}</b>
          </u>
        </Text>
      )}

      {data.status === 'rejected' && (
        <>
          <Text style={paragraph}>
            Your Registration as Delegate at {conventionDetails?.title} is <b>REJECTED</b>
          </Text>
          {data.message && (
            <Text style={paragraph}>
              <b>Message/Reason: </b>
              {data.message}
            </Text>
          )}
        </>
      )}

      <br />
      <Text style={paragraph}>
        <b>Full Name: </b>
        {data.firstName + ' ' + data.lastName}
      </Text>

      {dsInfo?.establishment && (
        <Text style={paragraph}>
          <b>Drugstore/Establishment: </b>
          {dsInfo.establishment}
        </Text>
      )}
      {dsInfo?.chapter && (
        <Text style={paragraph}>
          <b>Chapter: </b>
          {dsInfo.chapter}
        </Text>
      )}

      <br />
      <Text style={paragraph}>Thank you,</Text>
      <Text style={paragraph}>
        <b>DSAP Office </b>
      </Text>
    </Html>
  )
}
