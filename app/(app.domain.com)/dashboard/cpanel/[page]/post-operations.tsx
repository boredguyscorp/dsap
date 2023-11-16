'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Post } from '@prisma/client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '@/components/shared/icons'
import { siteConfig } from '@/app/config'
import { deletePost } from '@/actions/post'
// import { SettingsDialog } from '@/components/editor/settings/post-settings'

// async function deletePost(postId: string) {
//   const response = await fetch(`/api/posts/${postId}`, {
//     method: 'DELETE'
//   })

//   if (!response?.ok) {
//     toast({
//       title: 'Something went wrong.',
//       description: 'Your post was not deleted. Please try again.',
//       variant: 'destructive'
//     })
//   }

//   return true
// }

interface PostOperationsProps {
  post: Pick<Post, 'id' | 'slug' | 'title' | 'image' | 'imagesGallery' | 'page'>
  page: string
}

export function PostOperations({ post, page }: PostOperationsProps) {
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  // const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)
  const [isDeleting, startDeleting] = React.useTransition()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted'>
          <Icons.ellipsis className='h-4 w-4' />
          <span className='sr-only'>Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem>
            <Link href={`/post/${post.id}?page=${page}`} className='flex w-full'>
              Edit Content
            </Link>
          </DropdownMenuItem>

          {/* <DropdownMenuItem>
            <SettingsDialog post={post} />
          </DropdownMenuItem> */}

          <DropdownMenuItem
            className='flex cursor-pointer items-center text-destructive focus:text-destructive'
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem disabled={!post.published}>
            <Link
              href={`${siteConfig.url.home}/${page}/${post.slug}`}
              target='_blank'
              rel='noreferrer'
              className='flex w-full items-center'
            >
              <Icons.link className='mr-2 h-4 w-4' /> Visit Page
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault()
                // setIsDeleteLoading(true)

                try {
                  startDeleting(async () => {
                    const deleted = await deletePost(post.id)

                    if (deleted) {
                      setShowDeleteAlert(false)
                      router.refresh()
                    }
                  })
                } catch (error) {
                  setShowDeleteAlert(false)
                  toast({
                    title: 'Something went wrong.',
                    description: 'Your post was not deleted. Please try again.',
                    variant: 'destructive'
                  })
                }
              }}
              className='bg-red-600 focus:ring-red-600'
            >
              {isDeleting ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : <Icons.trash className='mr-2 h-4 w-4' />}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
