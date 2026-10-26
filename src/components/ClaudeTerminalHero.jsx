import React, { useState } from 'react';
import ClaudeMascot from './ClaudeMascot';
import { Terminal, Copy, Check, ChevronRight, AlertTriangle, Sparkles } from 'lucide-react';

export default function ClaudeTerminalHero() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('status');

  const copyDomain = () => {
    navigator.clipboard.writeText('sithumdf.study');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      margin: '2rem 0',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--cli-bg)',
      color: 'var(--cli-text)',
      boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(222, 88, 68, 0.25)',
      overflow: 'hidden',
      border: '1px solid var(--cli-border)',
      textAlign: 'left',
    }}>
      {/* Terminal Title Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1rem',
        background: 'var(--cli-header)',
        borderBottom: '1px solid var(--cli-border)',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-mono)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#DE5844' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span style={{ marginLeft: 8, color: 'var(--cli-muted)', fontWeight: 500 }}>
            claude-code — sithumdf.study
          </span>
        </div>

        <button
          onClick={copyDomain}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            color: 'var(--cli-muted)',
            fontSize: '0.74rem',
            padding: '3px 8px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
          title="Copy domain name"
        >
          {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'sithumdf.study'}</span>
        </button>
      </div>

      {/* Terminal Body — Faithfully replicating Claude Code CLI layout */}
      <div style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)' }}>
        {/* Screenshot Banner Recreation */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.25rem',
          marginBottom: '1rem',
        }}>
          {/* Mascot in Terracotta */}
          <div style={{ paddingTop: '2px' }}>
            <ClaudeMascot size={42} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>Claude Code</span>
              <span style={{ fontSize: '0.85rem', color: '#9E9A92' }}>v2.1.310</span>
            </div>
            
            <div style={{ fontSize: '0.85rem', color: '#9E9A92', marginTop: '2px' }}>
              <span>Sonnet 3.5</span>
              <span style={{ margin: '0 6px' }}>•</span>
              <span>Visual Study Architect</span>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#7E7A72', marginTop: '3px', wordBreak: 'break-all' }}>
              ~\MyWorks\My Softwares\sithumdf.study\sithumdf_study_v0
            </div>
          </div>
        </div>

        {/* Warning Banner in Amber from Screenshot */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '0.65rem 0.85rem',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: '#FCD34D',
          marginBottom: '1.25rem',
          lineHeight: 1.45,
        }}>
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px', color: '#F59E0B' }} />
          <div>
            <span style={{ fontWeight: 600, color: '#FBBF24' }}>sithumdf.study deployment notice</span>
            <span style={{ color: '#D1D5DB', margin: '0 6px' }}>·</span>
            <span style={{ color: '#E5E7EB' }}>
              Domain is reserved. Interactive visual simulations for complex studies are currently compiling.
            </span>
          </div>
        </div>

        {/* Interactive CLI Action Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          {[
            { id: 'status', cmd: 'study --status' },
            { id: 'vision', cmd: 'study --vision' },
            { id: 'topics', cmd: 'study --curriculum' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.78rem',
                border: activeTab === tab.id ? '1px solid #DE5844' : '1px solid #38352F',
                background: activeTab === tab.id ? 'rgba(222, 88, 68, 0.18)' : '#23211D',
                color: activeTab === tab.id ? '#FF8674' : '#ABA69C',
              }}
            >
              $ {tab.cmd}
            </button>
          ))}
        </div>

        {/* CLI Tab Output */}
        <div style={{
          background: '#131210',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #2B2823',
          fontSize: '0.82rem',
          lineHeight: 1.6,
        }}>
          {activeTab === 'status' && (
            <div>
              <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} />
                <span>Domain DNS & SSL: active (sithumdf.study)</span>
              </div>
              <div style={{ color: '#DE5844', marginTop: '4px' }}>
                &gt; Stage: Pre-launch Visual Engine (React + HTML5 Canvas)
              </div>
              <div style={{ color: '#9E9A92', marginTop: '4px' }}>
                &gt; Goal: Interactive visual models transforming abstract equations into visceral intuition.
              </div>
            </div>
          )}

          {activeTab === 'vision' && (
            <div>
              <div style={{ color: '#FBBF24', fontWeight: 600 }}>[Philosophy: See it to Believe it]</div>
              <div style={{ color: '#E5E7EB', marginTop: '4px' }}>
                Most subjects are taught through static equations. On <strong>sithumdf.study</strong>, every model will be an interactive laboratory where you can manipulate parameters, feel the mathematical dynamics, and explore cause &amp; effect visually.
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div>
              <div style={{ color: '#38BDF8', fontWeight: 600 }}>Planned Interactive Visual Modules:</div>
              <div style={{ color: '#9E9A92', marginTop: '4px' }}>
                1. Physics: Wave superposition, Keplerian gravity, Double pendulum chaos<br />
                2. Mathematics: Fourier decompositions, Eigenvalue transforms, Calculus contours<br />
                3. Computer Science: Graph algorithms, Neural weights flow, Sorting dynamics
              </div>
            </div>
          )}

          {/* Prompt line with blinking cursor */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', color: '#9E9A92' }}>
            <span style={{ color: '#DE5844', marginRight: '6px' }}>sithumdf@study:~$</span>
            <span style={{ color: '#F3F4F6' }}>awaiting official launch...</span>
            <span className="blink-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}
