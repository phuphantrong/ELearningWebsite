import Link from "next/link";
import "./home.css";

export default function HomePage() {
    return (
        <div className="home-container">
            <header className="hero">
                <h1>Welcome to EdTech Platform</h1>
                <p>Master new skills with our premium courses.</p>
                <Link href="/courses" className="cta-button">Browse Courses</Link>
            </header>
            <section className="features">
                <div className="feature-card">
                    <h3>Expert Instructors</h3>
                    <p>Learn from industry leaders.</p>
                </div>
                <div className="feature-card">
                    <h3>Flexible Learning</h3>
                    <p>Study at your own pace.</p>
                </div>
                <div className="feature-card">
                    <h3>Certificate</h3>
                    <p>Earn certificates upon completion.</p>
                </div>
            </section>
        </div>
    );
}
