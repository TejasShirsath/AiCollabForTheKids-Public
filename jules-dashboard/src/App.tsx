import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AntigravityConsole from './components/AntigravityConsole';
import DomainManager from './components/DomainManager';
import AgeVerificationModal from './components/AgeVerificationModal';
import CommandCenter from './components/CommandCenter';
import ComingSoon from './components/ComingSoon';
import WelcomeModal from './components/WelcomeModal';
import AnalyticsHub from './components/AnalyticsHub';
import CommunityHub from './components/CommunityHub';
import OperationsHub from './components/OperationsHub';
import GovernanceConsole from './components/GovernanceConsole';
import SecurityAudit from './components/SecurityAudit';
import ImpactTracker from './components/ImpactTracker';
import SetupScripts from './components/SetupScripts';
import Transparency from './pages/Transparency';
import GospelRevenue from './pages/GospelRevenue';
import PreorderKickstarter from './pages/PreorderKickstarter';
import OpsControl from './pages/OpsControl';
import MediaCreatorDroid from './components/MediaCreatorDroid';
import DatingPlatform from './components/DatingPlatform';
import SubscriptionCheckout from './components/SubscriptionCheckout';
import SkeletonDemo from './components/SkeletonDemo';
import { Image, BookOpen } from './components/IconComponents';
import { View } from './types';

const App: React.FC = () => {
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [view, setView] = useState<View>('dashboard');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const verified = localStorage.getItem('age_verified');
        if (verified === 'true') setIsAgeVerified(true);
        
        // Show welcome modal for first-time visitors
        const hasSeenWelcome = localStorage.getItem('has_seen_welcome');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
            localStorage.setItem('has_seen_welcome', 'true');
        }
    }, []);

    if (!isAgeVerified) {
        return <AgeVerificationModal onVerify={() => {
            localStorage.setItem('age_verified', 'true');
            setIsAgeVerified(true);
        }} />;
    }

    const renderView = () => {
        switch (view) {
            // Working views
            case 'dashboard':
                return <DashboardView />;
            case 'antigravity':
                return <AntigravityConsole />;
            case 'domains':
                return <DomainManager />;
            case 'command':
                return <CommandCenter onLogAction={console.log} repoStatus="Synced" onCheckStatus={() => console.log('Checking status...')} />;
            
            // Command Center Group
            case 'governance':
                return <GovernanceConsole />;
            case 'security':
                return <SecurityAudit />;
            case 'impact':
                return <ImpactTracker />;
            case 'audit':
                return <AnalyticsHub />;
            case 'transparency':
                return <Transparency />;
            case 'gospel':
                return <GospelRevenue />;

            // Ventures Group
            case 'subscribe':
                return <SubscriptionCheckout />;
            case 'dating':
                return <DatingPlatform />;
            case 'store':
            case 'dao':
            case 'kickstarter':
                return <PreorderKickstarter />;
            
            // Operations & Dev Group
            case 'scripts':
                return <SetupScripts />;
            case 'edu':
            case 'pr':
            case 'review':
                return <OperationsHub />;
            
            // Creative Suite Group
            case 'droid':
                return <MediaCreatorDroid />;
            case 'media':
                return <ComingSoon viewName="Media Studio" icon={Image} description="Create, edit, and manage multimedia content for marketing and education." category="Creative Suite" />;
            case 'kids':
                return <ComingSoon viewName="Edu-Gen Studio" icon={BookOpen} description="Generate educational content and interactive learning materials for children." category="Creative Suite" />;
            
            // Intelligence Group → Community Hub (AI Support)
            case 'browser':
            case 'chat':
            case 'live':
            case 'mobile':
                return <CommunityHub />;

            // Unified Ops Control
            case 'ops':
                return <OpsControl />;
            
            // Development/Demo Views
            case 'skeleton-demo':
                return <SkeletonDemo />;

            default:
                return <DashboardView />;
        }
    };

    return (
        <div className="flex h-screen bg-brand-void text-brand-text font-sans overflow-hidden">
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
            <Sidebar
                currentView={view}
                onSetView={setView}
                onShowWelcome={() => setShowWelcome(true)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
            />
            <div className="flex-1 flex flex-col relative overflow-hidden bg-brand-void">
                {renderView()}
            </div>
        </div>
    );
};

export default App;
