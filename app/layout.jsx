import '@/styles/globals.css';

export const metadata = {
  title: 'Promptopia',
  description: 'Discover & Share AI Prompts'
}

const RootLayout = ({children}) => {
  return (
    <html lang='en'>
      <body>
        <div className="main">
          <div className='gradient' />
        </div>
        <main className='relative z-10 flex justify-center items-center flex-col max-w-7xl mx-auto sm:px-16 px-6'>
          {children}
        </main>
      </body>
    </html>
  )
}

export default RootLayout;