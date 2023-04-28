import { useEffect, useState, useRef} from 'react'
import '../Styles/TitleScreen.css'
import '../Styles/Background.css'
import { SnakeLoadbar } from '../Components/SnakeView'
import VersionTag, {versionText,PatchNotes} from '../Components/Version'
import { midiPlayer, songPlayer } from '../Components/Sound'


export function Title({onPresent}){

    const [submenu, setSubmenu] = useState()

    useEffect(()=>{
        midiPlayer.play('threefour.mid');
    },[])

    const newGamePitch = ()=>{
        onPresent('/pitch')
    }

    return <div className='TitleScreen Background'>
        <section className='MainTitle'>
            <h1>Sneel</h1>
            <SnakeLoadbar area={12}/>
        </section>
        
            <h2 className='SubTitle '>A sight reading game</h2>
            
            <section className={'Selections'}>
                    <div> {submenu === 'practice' ? 
                        <div className={'submenu selected'}>
                            <div>
                                <h2 className='title'>Practice:</h2>
                                <div>
                                    <button onClick={newGamePitch}> Pitch </button>
                                    <button disabled={true}> Rhythm </button>
                                </div>
                            </div>
                        </div>
                        :
                        <button onClick={()=>{setSubmenu('practice')}}> Practice </button>
                    }</div>
                    <button disabled={true}> Story </button>
                    <button disabled={true}> Learn </button>
                    <div>  {submenu === 'options' ? 
                        <div className={'submenu selected'}>
                            <div>
                                <h2 className='title'>Options:</h2>
                                <button disabled={true}> Music Volume </button>
                                <button disabled={true}> Input Volume </button>
                            </div>
                            <div>
                                <h2 className='title'>Development:</h2>
                                <button onClick={()=>{onPresent('/testzone')}}> Test Zone </button>
                            </div>
                        </div>
                        :<button disabled={false} onClick={()=>{setSubmenu('options')}}> Options </button>
                    }</div>
                    <button disabled={true}> About </button>
                
            </section>


        <section className='WhatsNew Bubble Stem'>
            <div>
            <span>Check out the <a href="https://github.com/purewack/sneel-web">GitHub page</a></span>
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"></img>
            </div>
            <details>
                <summary>Patch notes: </summary>
                <PatchNotes/>
            </details>
        </section>

        <VersionTag />
    </div>
}