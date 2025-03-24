import React from 'react';
import Button from '@/core/atoms/Button/Button';
import { useRouter } from 'next/router';

const Confirmation = () => {
  const router = useRouter();

  const handleDoneClick = () => {
    router.push('/');
  };
  return (
    <div>
      <h1 className="text-center mb-8 font-latoRegular">THANK YOU!</h1>
      <p className="text-base mb-4">
        You will receive a confirmation email with the details of your appointment. Please add to
        your calendar and call in advance if you must cancel or reschedule. See you soon!{' '}
      </p>
      <br />
      <h4 className="font-latoRegular mb-4">What to bring</h4>
      <hr className="my-2 mx-auto overflow-hidden border-borderinset" />
      <label className="font-latoBold text-xs mb-1">
        <strong>1. Inspiration</strong>
      </label>
      <br />
      <p>
        Pictures from our customer room gallery, Houzz, Instagram or your Pinterest board... If you
        love it, bring it along!
        <br />
        You may also find inspiration with our
        <a href="https://visualizer.tileshop.com/#" className="underline font-latoBold ml-1">
          tile visualizer
        </a>
        , where you can try our tiles in various room scenes.
      </p>
      <br />
      <br />
      <label className="font-latoBold text-xs mb-1">
        <strong>2. Swatches</strong>
      </label>
      <br />
      <p>
        Bring in samples of anything already in your space or that you plan to use, including paint,
        cabinets, countertops and fabrics.
      </p>
      <br />
      <br />
      <label className="font-latoBold text-xs mb-1">
        <strong>3. Dimensions</strong>
      </label>
      <br />
      <p>
        Any measurements and photos you have of your space will help us better visualize your
        project.
      </p>
      <br />
      <br />
      <Button
        onClick={handleDoneClick}
        className="hover:bg-white w-fit my-1 text-sm px-6 rounded-md  py-3 text-black bg-white border border-black font-normal hover:font-bold uppercase"
      >
        Done
      </Button>
      <br />
      <br />
    </div>
  );
};

export default Confirmation;
