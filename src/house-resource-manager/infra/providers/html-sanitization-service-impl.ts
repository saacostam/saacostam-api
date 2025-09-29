import sanitizeHtml from "sanitize-html";
import type { HtmlSanitizationService } from "../../app/providers";

export class HtmlSanitizationServiceImpl implements HtmlSanitizationService {
	sanitizeHtml(html: string): string {
		return sanitizeHtml(html);
	}
}
