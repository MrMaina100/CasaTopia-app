//my re-usable button 
import {clsx, type ClassValue} from 'clsx'

import {twMerge} from 'tailwind-merge'


//utility function: merge tailwind classes
function cn(...inputs:ClassValue[]){
   return twMerge(clsx(inputs))
}


interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement>{
   disabled?: boolean
   type?: string 
   

}

const Button = ({children,type,className,disabled,...props}:ButtonProps) => {

  return <button type='submit' disabled={false} {...props} className={cn('bg-blue-600 rounded-full py-1.5 px-6 text-white ',className)}>
   {children}

  </button>

}
export default Button