import { useStoreContext } from '@/contexts/StoreContext'
import React from 'react'

const ReviewComponent = () => {

    const {storeInfo} = useStoreContext()

    return (
        <div>ReviewComponent</div>
    )
}

export default ReviewComponent