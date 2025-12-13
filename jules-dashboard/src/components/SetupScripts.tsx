import { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Shield,
  Server,
  Package,
  FileText,
  Activity,
  Zap,
  Container,
  Settings,
  GitBranch,
  Clock
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error' | 'starting';
  uptime?: string;
  port?: number;
  health?: 'healthy' | 'unhealthy' | 'unknown';
}

interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  duration?: string;
  command?: string;
}

export default function SetupScripts() {
  const [activeTab, setActiveTab] = useState<'overview' | 'deploy' | 'services' | 'database' | 'ssl' | 'monitoring'>('overview');
  const [deploymentInProgress, setDeploymentInProgress] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<'development' | 'staging' | 'production'>('development');

  // Mock service statuses
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'PostgreSQL Database', status: 'running', uptime: '21h 32m', port: 5432, health: 'healthy' },
    { name: 'API Server', status: 'running', uptime: '21h 30m', port: 3000, health: 'healthy' },
    { name: 'Admin Dashboard', status: 'running', uptime: '21h 28m', port: 8081, health: 'healthy' },
    { name: 'Cloudflare Tunnel', status: 'running', uptime: '21h 35m', health: 'healthy' },
    { name: 'Redis Cache', status: 'stopped', health: 'unknown' }
  ]);

  // Mock deployment steps
  const [deploymentSteps] = useState<DeploymentStep[]>([
    { id: '1', name: 'Environment Check', description: 'Validate Docker and dependencies', status: 'complete', duration: '2s', command: 'docker --version' },
    { id: '2', name: 'Database Setup', description: 'Initialize PostgreSQL with schema', status: 'complete', duration: '8s', command: 'docker compose up -d postgres' },
    { id: '3', name: 'API Deployment', description: 'Build and start API server', status: 'complete', duration: '15s', command: 'docker compose up -d api' },
    { id: '4', name: 'Frontend Build', description: 'Build admin dashboard', status: 'complete', duration: '12s', command: 'npm run build' },
    { id: '5', name: 'SSL Configuration', description: 'Setup Cloudflare tunnel', status: 'complete', duration: '5s', command: 'cloudflared tunnel run' },
    { id: '6', name: 'Health Checks', description: 'Verify all services', status: 'complete', duration: '3s', command: 'curl http://localhost:3000/health' }
  ]);

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch(status) {
      case 'running': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'stopped': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'starting': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStepIcon = (status: DeploymentStep['status']) => {
    switch(status) {
      case 'complete': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'running': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleQuickDeploy = () => {
    setDeploymentInProgress(true);
    // Simulate deployment process
    setTimeout(() => {
      setDeploymentInProgress(false);
    }, 5000);
  };

  const handleServiceToggle = (serviceName: string) => {
    setServices(prev => prev.map(s => 
      s.name === serviceName 
        ? { ...s, status: s.status === 'running' ? 'stopped' : 'starting' }
        : s
    ));
    
    // Simulate service startup
    setTimeout(() => {
      setServices(prev => prev.map(s => 
        s.name === serviceName && s.status === 'starting'
          ? { ...s, status: 'running', health: 'healthy' }
          : s
      ));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="w-10 h-10 text-purple-300" />
          <h1 className="text-4xl font-bold text-white">P21 Setup & Deployment</h1>
        </div>
        <p className="text-purple-200 text-lg">One-command deployment orchestration for #FOR THE KIDS 💙</p>
      </div>

      {/* Environment Selector */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-300" />
            <span className="text-white font-medium">Environment:</span>
          </div>
          <div className="flex gap-2">
            {(['development', 'staging', 'production'] as const).map(env => (
              <button
                key={env}
                onClick={() => setSelectedEnvironment(env)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedEnvironment === env
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {env.charAt(0).toUpperCase() + env.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'deploy', label: 'Quick Deploy', icon: Zap },
          { id: 'services', label: 'Services', icon: Server },
          { id: 'database', label: 'Database', icon: Database },
          { id: 'ssl', label: 'SSL/Tunnels', icon: Shield },
          { id: 'monitoring', label: 'Monitoring', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <Server className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-white">5/5</span>
              </div>
              <p className="text-green-400 font-medium">Services Running</p>
              <p className="text-purple-200 text-sm">All systems operational</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <Container className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">23</span>
              </div>
              <p className="text-blue-400 font-medium">Docker Containers</p>
              <p className="text-purple-200 text-sm">20+ active instances</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">21h</span>
              </div>
              <p className="text-purple-400 font-medium">Average Uptime</p>
              <p className="text-purple-200 text-sm">99.9% availability</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-white">6/6</span>
              </div>
              <p className="text-green-400 font-medium">Health Checks</p>
              <p className="text-purple-200 text-sm">All passing</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={handleQuickDeploy}
                disabled={deploymentInProgress}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Full Deploy (P21)
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Restart Services
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2">
                <Database className="w-5 h-5" />
                Migrate Database
              </button>
            </div>
          </div>

          {/* Recent Deployments */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-400" />
              Recent Deployments
            </h3>
            <div className="space-y-3">
              {[
                { time: '2 hours ago', status: 'success', message: 'Full deployment completed successfully', duration: '45s' },
                { time: '5 hours ago', status: 'success', message: 'Database migration v1.2.3', duration: '12s' },
                { time: '1 day ago', status: 'success', message: 'CI/CD pipeline configuration', duration: '28s' }
              ].map((deployment, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">{deployment.message}</p>
                      <p className="text-purple-200 text-sm">{deployment.time} • {deployment.duration}</p>
                    </div>
                  </div>
                  <button className="text-purple-300 hover:text-purple-100 text-sm">View Logs</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deploy' && (
        <div className="space-y-6">
          {/* Deployment Configuration */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-400" />
              Deployment Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2">Docker Compose File</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white">
                  <option>docker-compose-for-the-kids.yml</option>
                  <option>docker-compose.prod.yml</option>
                  <option>docker-compose.dev.yml</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  Run database migrations
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  Build with cache
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  Force rebuild images
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                  Run health checks
                </label>
              </div>
            </div>
          </div>

          {/* Deployment Steps */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              Deployment Pipeline
            </h3>
            <div className="space-y-3">
              {deploymentSteps.map(step => (
                <div key={step.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">{step.name}</h4>
                      {step.duration && <span className="text-purple-300 text-sm">{step.duration}</span>}
                    </div>
                    <p className="text-purple-200 text-sm mb-2">{step.description}</p>
                    {step.command && (
                      <code className="text-xs bg-black/30 text-green-400 px-2 py-1 rounded font-mono">
                        $ {step.command}
                      </code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deploy Button */}
          <button 
            onClick={handleQuickDeploy}
            disabled={deploymentInProgress}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-8 py-6 rounded-xl font-bold text-xl transition-all shadow-2xl hover:shadow-green-500/50 flex items-center justify-center gap-3"
          >
            {deploymentInProgress ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                Deployment in Progress...
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                Execute Full Deployment
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-400" />
              Service Management
            </h3>
            <div className="space-y-3">
              {services.map(service => (
                <div key={service.name} className={`p-4 rounded-lg border ${getStatusColor(service.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Container className="w-5 h-5" />
                      <div>
                        <h4 className="text-white font-medium">{service.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-purple-200">
                            Status: {service.status}
                          </span>
                          {service.uptime && (
                            <span className="text-sm text-purple-200">Uptime: {service.uptime}</span>
                          )}
                          {service.port && (
                            <span className="text-sm text-purple-200">Port: {service.port}</span>
                          )}
                          {service.health && (
                            <span className={`text-sm ${service.health === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>
                              {service.health}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleServiceToggle(service.name)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          service.status === 'running'
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                        }`}
                      >
                        {service.status === 'running' ? (
                          <><Square className="w-4 h-4 inline mr-1" /> Stop</>
                        ) : (
                          <><Play className="w-4 h-4 inline mr-1" /> Start</>
                        )}
                      </button>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-purple-200 transition-all">
                        <RefreshCw className="w-4 h-4 inline mr-1" /> Restart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-green-400" />
              Database Management
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">Connection Status</h4>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">Connected to youandinotai_prod</span>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  PostgreSQL 15.3 • Host: localhost:5432
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Run Migrations
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2">
                  <Database className="w-5 h-5" />
                  Backup Database
                </button>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-orange-500/50 flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Reset (Dev Only)
                </button>
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  Seed Data
                </button>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-3">Migration History</h4>
                <div className="space-y-2">
                  {[
                    { name: '20231125_add_CHARITY_tracking.sql', status: 'applied', time: '2 hours ago' },
                    { name: '20231124_create_campaigns.sql', status: 'applied', time: '1 day ago' },
                    { name: '20231123_init_schema.sql', status: 'applied', time: '2 days ago' }
                  ].map((migration, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">{migration.name}</span>
                      </div>
                      <span className="text-purple-200 text-sm">{migration.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ssl' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              SSL & Cloudflare Tunnels
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h4 className="text-green-400 font-medium">Tunnel Active</h4>
                </div>
                <p className="text-purple-200 text-sm">Cloudflare tunnel running on all domains</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium">Active Tunnels</h4>
                {[
                  { domain: 'dashboard.aidoesitall.website', service: 'Admin Dashboard', port: 8081 },
                  { domain: 'api.aidoesitall.website', service: 'API Server', port: 3000 },
                  { domain: 'admin.aidoesitall.website', service: 'Admin Panel', port: 8081 }
                ].map((tunnel, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{tunnel.domain}</p>
                        <p className="text-purple-200 text-sm">{tunnel.service} → localhost:{tunnel.port}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-400 text-sm">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Restart Tunnels
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configure DNS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-400" />
              System Monitoring
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-purple-200 text-sm mb-1">CPU Usage</p>
                  <p className="text-2xl font-bold text-white">24%</p>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '24%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-purple-200 text-sm mb-1">Memory Usage</p>
                  <p className="text-2xl font-bold text-white">2.1 / 8 GB</p>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '26%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-purple-200 text-sm mb-1">Disk Usage</p>
                  <p className="text-2xl font-bold text-white">45 / 256 GB</p>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-3">Request Rate</h4>
                <div className="h-32 flex items-end justify-between gap-2">
                  {[45, 52, 48, 65, 72, 58, 70, 68, 75, 82, 78, 88, 85, 92].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <p className="text-purple-200 text-sm mt-2">Last 14 minutes • Average: 420 req/min</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">All Systems Operational</span>
          </div>
          <span className="text-purple-200 text-sm">#FOR THE KIDS 💙 • Environment: {selectedEnvironment}</span>
        </div>
      </div>
    </div>
  );
}
