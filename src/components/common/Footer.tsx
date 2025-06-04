import Image, { StaticImageData } from 'next/image';
import React from 'react';

export type FooterLinkSection = {
  section: string;
  links: { label: string; href: string }[];
};
export type FooterAppButton = {
  src: StaticImageData;
  alt: string;
  href: string;
};
export type FooterSocial = { icon: StaticImageData; href: string };

interface FooterProps {
  footerLinks: FooterLinkSection[];
  footerAppButtons: FooterAppButton[];
  footerSocials: FooterSocial[];
}

export default function Footer({
  footerLinks,
  footerAppButtons,
  footerSocials,
}: FooterProps) {
  return (
    <footer className='bg-white border-t border-gray-200 pt-16'>
      <div className='container max-w-[1300px] mx-auto  px-8 md:px-5 '>
        {/* Logo and Brand */}
        <div className='flex flex-col gap-8 '>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-full bg-purple-800'></div>
            <span className='text-2xl font-semibold text-gray-900'>Listd</span>
          </div>
        </div>
        <div className=' mx-auto py-10 flex flex-col md:flex-row md:justify-between md:items-start gap-12 '>
          {/* Navigation Columns */}
          <div className='grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-12 justify-between w-full lg:min-w-[600px]'>
            {/* Render navigation sections */}
            {footerLinks.map(section => (
              <div
                key={section.section}
                className={`flex flex-col gap-4 md:min-w-[150px]`}
              >
                <h4 className='font-bold text-[#0F172A]'>{section.section}</h4>
                <ul className='space-y-4 text-[#0F172A]'>
                  {section.links.map(link => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className='hover:text-purple-800 cursor-pointer'
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* App Download and Social */}
          <div className='flex flex-col items-center md:items-start gap-6 min-w-[220px]'>
            <h4 className='font-bold text-gray-900 '>DOWNLOAD US ON</h4>
            <div className='flex flex-col gap-3 w-full items-center md:items-start'>
              {footerAppButtons.map(btn => (
                <a href={btn.href} key={btn.alt} className='w-44 '>
                  <Image
                    src={btn.src}
                    alt={btn.alt}
                    className='w-full h-14 object-contain rounded mx-auto'
                  />
                </a>
              ))}
            </div>
            <div className='flex gap-6 mt-4 m'>
              {footerSocials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className='text-2xl text-gray-500 hover:text-purple-800 cursor-pointer'
                >
                  <Image src={social.icon} alt={social.href} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className='border-t border-gray-200 py-6 text-left text-gray-500 text-base'>
          ©{new Date().getFullYear()} Listd. All rights reserved
        </div>
      </div>
    </footer>
  );
}
