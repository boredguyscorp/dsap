import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  Menu,
  Key,
  MapPin,
  PieChart,
  AlertTriangleIcon,
  Copy,
  Save,
  Check,
  Edit,
  RefreshCcw,
  Phone,
  Mail,
  Bell,
  ExternalLink,
  type Icon as LucideIcon
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  close: X,
  menu: Menu,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  key: Key,
  map: MapPin,
  pieChart: PieChart,
  alert: AlertTriangleIcon,
  check: Check,
  copy: Copy,
  save: Save,
  edit: Edit,
  refresh: RefreshCcw,
  twitter: Twitter,
  phone: Phone,
  mail: Mail,
  bell: Bell,
  link: ExternalLink,
  logo: ({ circleColor, ...props }: LucideProps & { circleColor: string }) => (
    <svg
      width='800px'
      height='800px'
      viewBox='0 0 36 36'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      aria-hidden='true'
      role='img'
      className='iconify iconify--twemoji'
      preserveAspectRatio='xMidYMid meet'
      {...props}
    >
      <circle fill={circleColor === 'dark' ? '#ffffff' : '#000000'} cx={18} cy={18} r={18} />
      <path
        fill={circleColor === 'dark' ? '#000000' : '#ffffff'}
        d='M25.565 11.295c-2.116 0-4.195 1.322-5.799 2.712a21.08 21.08 0 0 1 1.147 1.364c.172.227.423.534.733.882c1.236-1.084 2.689-2.044 3.919-2.044c2.09 0 3.79 1.7 3.79 3.79s-1.7 3.79-3.79 3.79c-2.337 0-5.484-3.456-6.402-4.668c-.45-.596-4.521-5.826-8.729-5.826c-3.697 0-6.705 3.008-6.705 6.705s3.008 6.704 6.705 6.704c2.055 0 4.073-1.248 5.657-2.594a21.026 21.026 0 0 1-1.255-1.483a14.747 14.747 0 0 0-.624-.757c-1.204 1.032-2.594 1.919-3.778 1.919c-2.09 0-3.79-1.7-3.79-3.79s1.7-3.79 3.79-3.79c2.338 0 5.484 3.456 6.402 4.668c.45.596 4.521 5.826 8.729 5.826a6.711 6.711 0 0 0 6.704-6.704a6.71 6.71 0 0 0-6.704-6.704z'
      />
    </svg>
  ),
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      {...props}
      aria-hidden='true'
      focusable='false'
      data-prefix='fab'
      data-icon='github'
      role='img'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 496 512'
    >
      <path
        fill='currentColor'
        d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'
      ></path>
    </svg>
  ),
  divider: ({ className }: { className: string }) => (
    <svg
      fill='none'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1'
      viewBox='0 0 24 24'
      width='14'
      height='14'
      className={className}
    >
      <path d='M16.88 3.549L7.12 20.451' />
    </svg>
  ),
  google: ({ className }: { className: string }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 488 512' fill='currentColor' className={className}>
      <path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z' />
    </svg>
  ),
  drag: ({ className }: { className: string }) => (
    <svg
      fill='currentColor'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 700 700'
      width='700'
      height='700'
      className={className}
    >
      <path d='M449.53 315.65v-36.457c0-13.953-10.734-25.301-23.48-25.301-12.812 0-23.551 11.352-23.551 25.301v38.645a7.656 7.656 0 11-15.312 0v-49.254c0-13.949-9.961-25.77-22.707-25.77h-.723c-12.418 0-22.508 11.246-23.602 24.703v55.453a7.656 7.656 0 11-15.312 0v-53.84c0-.184-.02-.371-.02-.559 0-.437.02-.875.02-1.312v-125.9c0-13.953-10.113-25.301-22.86-25.301s-22.882 11.344-22.894 25.28l-.13 208.8a7.649 7.649 0 01-13.562 4.856l-24.926-30.344h-.004a37.44 37.44 0 00-26.414-13.973 36.629 36.629 0 00-27.512 9.883c-.094.086-.191.203-.293.285l-4.55 3.828 86.241 165.66c13.555 26.043 39.176 42.328 66.863 42.328h99.914c42.23 0 76.621-37.148 76.664-82.688.024-24.18.047-42.367.067-57 .05-39.266.07-54.156-.031-97.395-.032-13.91-10.402-25.422-23.113-25.422h-.684c-12.742.004-22.777 11.801-22.777 25.754v19.742a7.656 7.656 0 11-15.312 0zM157.66 83.723l42.238 42.242v-.004a7.648 7.648 0 0010.828 0 7.802 7.802 0 000-10.945l-30.68-30.797h277.14V68.907h-275.43l28.97-28.852a7.62 7.62 0 00-.048-10.78 7.624 7.624 0 00-10.78.042L160.048 69.18a7.659 7.659 0 00-2.39 14.543zM521.51 39.887c20.859 8.64 30.766 32.555 22.125 53.414-8.64 20.859-32.555 30.766-53.414 22.125s-30.766-32.555-22.125-53.414 32.555-30.766 53.414-22.125'></path>
      <use x='70' y='576.406'></use>
      <use x='74.012' y='576.406'></use>
      <use x='76.711' y='576.406'></use>
      <use x='80.418' y='576.406'></use>
      <use x='84.109' y='576.406'></use>
      <use x='86.723' y='576.406'></use>
      <use x='90.434' y='576.406'></use>
      <use x='96.25' y='576.406'></use>
      <use x='100.168' y='576.406'></use>
      <use x='105.637' y='576.406'></use>
      <use x='109.871' y='576.406'></use>
      <use x='111.746' y='576.406'></use>
      <use x='114.445' y='576.406'></use>
      <use x='118.133' y='576.406'></use>
      <use x='123.934' y='576.406'></use>
      <use x='127.871' y='576.406'></use>
      <use x='131.766' y='576.406'></use>
      <use x='135.453' y='576.406'></use>
      <use x='138.711' y='576.406'></use>
      <use x='141.324' y='576.406'></use>
      <use x='144.02' y='576.406'></use>
      <use x='70' y='581.875'></use>
      <use x='72.379' y='581.875'></use>
      <use x='75.078' y='581.875'></use>
      <use x='78.832' y='581.875'></use>
      <use x='86.438' y='581.875'></use>
      <use x='89.051' y='581.875'></use>
      <use x='92.941' y='581.875'></use>
      <use x='98.555' y='581.875'></use>
      <use x='103.133' y='581.875'></use>
      <use x='106.891' y='581.875'></use>
      <use x='110.785' y='581.875'></use>
      <use x='116.582' y='581.875'></use>
      <use x='120.59' y='581.875'></use>
      <use x='123.285' y='581.875'></use>
      <use x='127.043' y='581.875'></use>
      <use x='128.918' y='581.875'></use>
      <use x='132.625' y='581.875'></use>
      <use x='135.867' y='581.875'></use>
    </svg>
  )
}
