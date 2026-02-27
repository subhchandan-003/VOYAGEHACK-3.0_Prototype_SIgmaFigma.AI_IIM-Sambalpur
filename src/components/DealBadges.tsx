import { TrendingUp, Award, Clock, Sparkles, Zap, ThumbsUp } from 'lucide-react';
import { Badge } from './ui/badge';

interface DealBadgesProps {
  confidenceScore: number;
  matchScore: number;
  isPopular?: boolean;
  isLimitedTime?: boolean;
  isBestValue?: boolean;
}

export function DealBadges({ 
  confidenceScore, 
  matchScore, 
  isPopular = false,
  isLimitedTime = false,
  isBestValue = false 
}: DealBadgesProps) {
  const badges = [];

  // AI Recommended badge for high confidence
  if (confidenceScore >= 90) {
    badges.push({
      icon: Sparkles,
      text: 'AI Recommended',
      color: 'bg-purple-500 text-white hover:bg-purple-600',
    });
  }

  // Best Match badge
  if (matchScore >= 95) {
    badges.push({
      icon: Award,
      text: 'Best Match',
      color: 'bg-green-500 text-white hover:bg-green-600',
    });
  }

  // Popular badge
  if (isPopular) {
    badges.push({
      icon: TrendingUp,
      text: 'Popular Choice',
      color: 'bg-orange-500 text-white hover:bg-orange-600',
    });
  }

  // Limited Time badge
  if (isLimitedTime) {
    badges.push({
      icon: Clock,
      text: 'Limited Offer',
      color: 'bg-red-500 text-white hover:bg-red-600 animate-pulse',
    });
  }

  // Best Value badge
  if (isBestValue) {
    badges.push({
      icon: Zap,
      text: 'Best Value',
      color: 'bg-yellow-500 text-white hover:bg-yellow-600',
    });
  }

  // Great Deal badge for good confidence
  if (confidenceScore >= 80 && confidenceScore < 90) {
    badges.push({
      icon: ThumbsUp,
      text: 'Great Deal',
      color: 'bg-blue-500 text-white hover:bg-blue-600',
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, idx) => (
        <Badge
          key={idx}
          className={`${badge.color} border-0 shadow-sm`}
        >
          <badge.icon className="w-3 h-3 mr-1" />
          {badge.text}
        </Badge>
      ))}
    </div>
  );
}
