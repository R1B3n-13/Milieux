import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';
import star from '@/assets/icons/star.svg';

interface ReviewCardProps {
  imgURL: string;
  customerName: string;
  rating: number;
  feedback: string;
}


const ReviewCard: React.FC<ReviewCardProps> = ({ imgURL, customerName, rating, feedback }) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <Card className='p-10'>
        <CardContent className='flex flex-col justify-center items-center'>
          <Image src={imgURL} alt='customerImage' className='rounded-full object-cover w-[120px] h-[120px]' />
          <p className='mt-6 max-w-sm text-center info-text'>{feedback}</p>
          <div className='mt-3 flex justify-center items-center gap-2.5'>
            <Image className='object-contain m-0' src={star} alt='review' height={24} width={24} />
            <p className='text-xl font-montserrat text-slate-gray'>{rating}</p>
          </div>
          <h3 className='mt-1 font-palanquin text-3xl text-center font-bold'>{customerName}</h3>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewCard;
