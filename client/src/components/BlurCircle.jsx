const BlurCircle = ({ top = 'auto', left = 'auto', right = 'auto', bottom = 'auto' }) => {
  return (
    <div className='absolute h-60 w-60 -z-60 aspect-square rounded-full bg-primary/30 blur-2xl' style={{ top: top, bottom: bottom, left: left, right: right }}>
    </div>
  )
}

export default BlurCircle
