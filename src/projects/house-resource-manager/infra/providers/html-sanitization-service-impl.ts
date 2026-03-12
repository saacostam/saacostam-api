import sanitizeHtml from "sanitize-html";
import type { HtmlSanitizationService } from "../../app/providers";

export class HtmlSanitizationServiceImpl implements HtmlSanitizationService {
	sanitizeHtml(html: string): string {
		return sanitizeHtml(html, {
			allowedAttributes: {
				ul: ["class", "data-type"],
				li: ["class", "data-checked", "data-type"],
				input: ["type"],
			},
			allowedTags: sanitizeHtml.defaults.allowedTags.concat(["input", "label"]),
			selfClosing: sanitizeHtml.defaults.selfClosing.filter(
				(v) => !["input"].includes(v),
			),
		});
	}
}
