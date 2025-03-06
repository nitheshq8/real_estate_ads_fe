import React from 'react'
import PropTypes from 'prop-types'
import SubscriptionPlanDetails from '@/components/Subscription/SubscriptionPlanDetails'
// import SubscriptionPlanDetails from '@/components/SubscriptionPlanDetails'
// import CurrentSubscriptionPlan from '@/components/Subscription/CurrentSubscriptionPlan'

function page(props:any) {
  return (
    <>
      {/* <SubscriptionPlanDetails/>
    <CurrentSubscriptionPlan/> */}
    <SubscriptionPlanDetails/>
    </>
 
  )
}

page.propTypes = {}

export default page
