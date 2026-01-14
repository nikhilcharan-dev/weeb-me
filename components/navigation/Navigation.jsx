import './styles.css';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function Navigation() {
    return (
        <nav className="nav">
            <ul className="nav-list">
                <li onClick={() => scrollToPanel(0)}>Home</li>
                <li onClick={() => scrollToPanel(4)}>Projects</li>
                <li onClick={() => scrollToPanel(5)}>Timeline</li>
                <li onClick={() => scrollToPanel(7)}>Contacts</li>
            </ul>
        </nav>
    );
}

const scrollToPanel = (panelIndex) => {
    const st = ScrollTrigger.getById("horizontal-scroll");
    if (!st) return;

    const tl = st.animation;
    const label = `panel-${panelIndex}`;

    if (!tl.labels[label]) return;

    // progress of label (0 → 1)
    const progress = tl.labels[label] / tl.duration();

    const scrollPosition =
        st.start + (st.end - st.start) * progress;

    gsap.to(window, {
        scrollTo: scrollPosition,
        duration: 1.2,
        ease: "power3.inOut",
    });
}
