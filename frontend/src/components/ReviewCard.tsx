import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from 'next/image';
import star from '@/assets/icons/star.svg';
import { useStoreContext } from '@/contexts/StoreContext';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  review: string;
  customerName?: string; // Assuming customerName is part of the review object
  imgurl?: string; // If you store customer images, this can be optional
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {

  const { storeInfo, loggedUserInfo } = useStoreContext();

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Card className=" w-full rounded-2xl p-2">
        <CardContent className="flex flex-col justify-betwen gap-5 items-starts  w-full">
          <div className='flex flex-row pt-5 items-center gap-2'>
            <div className='h-fit'>
              <Image src={loggedUserInfo.dp} alt="profile" height={50} width={50} className="rounded-full w-[40px] h-[40px]" />
            </div>
            <h1 className='font-bold'>{loggedUserInfo.name}</h1>
          </div>
          <div className='flex flex-row justify-between gap-2 w-[90%]'>
            <div className="mt-3 flex justify-center items-center gap-2.5">
              <Image className="object-contain m-0" src={star} alt="review" height={24} width={24} />
              <h1 className="text-4xl font-montserrat text-slate-gray">{review.rating.toFixed(1)}</h1>
            </div>

            <div className='w-[80%]'>
              <p className="mt-6 max-w-sm text-center info-text">{review.review}</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewCard;
