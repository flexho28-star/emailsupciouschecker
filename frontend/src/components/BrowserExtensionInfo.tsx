import { Puzzle, Shield, CheckCircle } from 'lucide-react';

export const BrowserExtensionInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Browser Extension Integration
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-mono">
          Extend our AI phishing detection capabilities directly into your browser context.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Overview and Steps */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyber-blue/10 rounded-xl text-cyber-blue">
                <Puzzle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-mono text-sm text-slate-200 uppercase tracking-wider">
                  Chrome / Edge Extension Setup
                </h3>
                <p className="text-xs text-slate-500 font-mono">Manifest V3 Compliant</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              We have pre-packaged a browser extension in your project under <span className="text-cyber-blue font-mono">static/extension/</span>. 
              This extension allows you to highlight text on any web page (e.g., Gmail, Outlook, or a suspicious website), 
              right-click, and select <strong className="text-cyber-blue">"Scan for Phishing"</strong> to analyze it immediately.
            </p>

            <div className="space-y-3.5 mt-4">
              <h4 className="text-xs font-mono text-slate-405 uppercase">Installation Steps:</h4>
              
              <div className="flex gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-cyber-blue font-mono flex items-center justify-center shrink-0 border border-slate-700">1</div>
                <div>
                  <p className="font-medium text-slate-200">Open Extension Manager</p>
                  <p className="text-slate-500 mt-0.5">In Chrome, navigate to <span className="text-cyber-blue font-mono">chrome://extensions/</span> (or click Settings &gt; Extensions).</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-cyber-blue font-mono flex items-center justify-center shrink-0 border border-slate-700">2</div>
                <div>
                  <p className="font-medium text-slate-200">Enable Developer Mode</p>
                  <p className="text-slate-500 mt-0.5">Toggle the <strong className="text-slate-300">"Developer mode"</strong> switch in the top-right corner of the page.</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-cyber-blue font-mono flex items-center justify-center shrink-0 border border-slate-700">3</div>
                <div>
                  <p className="font-medium text-slate-200">Load Unpacked Extension</p>
                  <p className="text-slate-500 mt-0.5">
                    Click the <strong className="text-slate-300">"Load unpacked"</strong> button in the top-left corner.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-cyber-blue font-mono flex items-center justify-center shrink-0 border border-slate-700">4</div>
                <div>
                  <p className="font-medium text-slate-200">Select Extension Folder</p>
                  <p className="text-slate-500 mt-0.5">
                    Select the <span className="text-cyber-blue font-mono">[project_root]/static/extension/</span> folder in the file dialog.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-cyber-green/5 border border-cyber-green/10 rounded-lg text-xs text-cyber-green font-mono flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Extension successfully configured! You can now scan emails from Gmail & Outlook.</span>
            </div>
          </div>
        </div>

        {/* Right Column: How It Works Visual */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4 text-left">
            <h3 className="font-mono text-xs text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              Feature Capabilities
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-cyber-blue shrink-0 border border-slate-800">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h5 className="font-semibold text-slate-200">Context Menu Integration</h5>
                  <p className="text-slate-500 mt-0.5">Highlight text on any website and scan it with a single right-click.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-cyber-green shrink-0 border border-slate-800">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h5 className="font-semibold text-slate-200">Gmail & Outlook Friendly</h5>
                  <p className="text-slate-500 mt-0.5">Works seamlessly inside webmail portals by capturing selected text and headers.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-cyber-yellow shrink-0 border border-slate-800">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h5 className="font-semibold text-slate-200">Instant Popup Diagnostics</h5>
                  <p className="text-slate-500 mt-0.5">Displays classification, risk scores, and brief AI explanations in a clean popup bubble.</p>
                </div>
              </div>
            </div>

            {/* Simulated UI Preview */}
            <div className="mt-6 border border-slate-850 rounded-lg p-3 bg-slate-950 font-mono text-[10px] space-y-2 select-none">
              <div className="text-slate-500 border-b border-slate-900 pb-1 flex justify-between">
                <span>EXTENSION PREVIEW</span>
                <span className="text-cyber-green">API CONNECTED</span>
              </div>
              <div className="p-2 bg-cyber-red/5 border border-cyber-red/20 rounded text-cyber-red">
                <p className="font-bold">PHISHING DETECTED (Risk: 87/100)</p>
                <p className="text-slate-400 mt-1 leading-normal">
                  Reason: Urgent payment requested. Impersonating Netflix billing department.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
