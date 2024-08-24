import React from 'react';

interface CardProps {
  imgURL: {
    prodImage: string;
  };
  changeImage: (url: string) => void;
  bigImage: string;
  accentColor: string;
}

const HomeProdCard: React.FC<CardProps> = ({ imgURL, changeImage, bigImage, accentColor }) => {

  const borderColor = 'border-['+accentColor+']';
  console.log(borderColor);
  console.log(bigImage);
  
  
  const handleClick = () => {
    if (bigImage !== imgURL.prodImage) {
      changeImage(imgURL.prodImage);
    }
  };

  return (
    <div 
      className={`border-2 rounded-xl ${bigImage === imgURL ? borderColor : 'border-transparent'} cursor-pointer max-sm:flex-1`} 
      onClick={handleClick}
    >
      <div className='flex justify-center items-center bg-card bg-center bg-cover sm:w-40 sm:h-40 rounded-xl max-sm:p-4'>
        <img 
          src={imgURL} 
          alt="product collection" 
          width={127} 
          height={103} 
          className='object-contain' 
        />
      </div>
    </div>
  );
};

export default HomeProdCard;
