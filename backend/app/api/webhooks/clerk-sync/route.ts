import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { handleUserCreated } from './handlers/user-created'


// User Created webhook
export { handleUserCreated } from './handlers/user-created'

// User Updated webhook
import { handleUserUpdated } from './handlers/user-updated'
export { handleUserUpdated } from './handlers/user-updated'

// User Deleted Handler
import { handleUserDeleted } from './handlers/user-deleted'
export { handleUserDeleted } from './handlers/user-deleted'

// Sync Org Members webhook
export { syncOrgMembers } from './handlers/sync-orgMembers'

// Organization Created webhook
import { handleOrgCreated } from './handlers/org-created'
export { handleOrgCreated } from './handlers/org-created'

// Organization Updated webhook
import { handleOrgUpdated } from './handlers/org-updated'
export { handleOrgUpdated } from './handlers/org-updated'

// Organization Deleted Handler
import { handleOrgDeleted } from './handlers/org-deleted'
export { handleOrgDeleted } from './handlers/org-deleted'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const eventType = evt.type
    const id = evt.data?.id

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    switch (eventType) {
      case 'user.created':
        console.log('userId:', evt.data.id)
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        if (typeof evt.data.id === 'string') {
          await handleUserDeleted({ id: evt.data.id })
        } else {
          console.error('user.deleted event missing id')
        }
        break
      case 'organization.created':
        await handleOrgCreated(evt.data)
        break
      case 'organization.updated':
        await handleOrgUpdated(evt.data)
        break
      case 'organization.deleted':
        if (typeof evt.data.id === 'string') {
          await handleOrgDeleted({ id: evt.data.id })
        } else {
          console.error('organization.deleted event missing id')
        }
        break
      default:
        console.log('Unknown event type:', eventType)
        break
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
