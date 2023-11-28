import { DevTool } from '@hookform/devtools'

export default function RHFDevTool({ control }: { control: any }) {
  return <DevTool control={control} />
}
