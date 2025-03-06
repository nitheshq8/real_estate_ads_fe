import React from 'react'
import PropTypes from 'prop-types'
import SubscriptionPlanDetails from '@/components/Subscription/SubscriptionPlanDetails'
import CreateAdModal from '@/components/PropertyPage/CreateAdModal'
// import SubscriptionPlanDetails from '@/components/SubscriptionPlanDetails'
// import CurrentSubscriptionPlan from '@/components/Subscription/CurrentSubscriptionPlan'

function page(props:any) {
  return (
    <div className='min-h-screen mt-8'>
      {/* <SubscriptionPlanDetails/>
    <CurrentSubscriptionPlan/> */}
<SubscriptionPlanDetails/>
    </div>
 
  )
}

page.propTypes = {}

export default page
